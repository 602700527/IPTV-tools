// Channel API - GET /api/channel/{hash}
import { getChannelByHash } from '../../utils/channel-cache.js';

/**
 * Handle /api/channel/{hash}
 * Returns channel details for the specified hash
 */
export async function handleApiChannel(request, env) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathParts = url.pathname.split('/');
    const hash = pathParts[pathParts.length - 1] || '';

    if (!hash) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Channel hash is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get channel from KV cache
    const channel = await getChannelByHash(env, hash);

    if (!channel) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Channel not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const channelUrl = `${origin}/channel/${hash}`;

    const response = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      'name': channel.channel_name,
      'description': `${channel.channel_name} - ${channel.group_title || 'Live TV'} - Stream from IPTV Search`,
      'thumbnailUrl': channel.logo || null,
      'uploadDate': new Date().toISOString().split('T')[0],
      'url': channelUrl,
      data: {
        channel: {
          id: channel.id,
          channel_name: channel.channel_name,
          group_title: channel.group_title,
          logo: channel.logo,
          play_url: channel.play_url,
          channel_hash: channel.channel_hash,
          source_name: channel.source_name
        }
      }
    };

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('[API Channel] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch channel data'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}